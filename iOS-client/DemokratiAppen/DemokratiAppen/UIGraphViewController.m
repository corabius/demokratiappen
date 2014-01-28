//
//  UIGraphViewController.m
//  DemokratiAppen
//
//  Created by Joakim Rydell on 2014-01-11.
//  Copyright (c) 2014 Joakim Rydell. All rights reserved.
//

#import "UIGraphViewController.h"
#import "Party.h"

@interface UIGraphViewController ()

@end

@implementation UIGraphViewController

- (id)initWithCoder:(NSCoder *)aDecoder
{
    self = [super initWithNibName:@"UIGraphView" bundle:[NSBundle mainBundle]];                                            
    
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];

}


- (void) viewWillAppear:(BOOL)animated {
    [self drawSomething];

    //timer = [NSTimer scheduledTimerWithTimeInterval:0.05 target:self selector:@selector(drawSomething) userInfo:nil repeats:YES];

}


- (void) viewDidDisappear:(BOOL)animated {
    [timer invalidate];
}


- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}


-(void) drawSomething {
    CGFloat width = (CGFloat)_graphView.frame.size.width;
    CGFloat height = (CGFloat)_graphView.frame.size.height;
    
    CGFloat imageScale = [[UIScreen mainScreen] scale];
    
    // Create a bitmap graphics context of the given size
    CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
    CGContextRef context = CGBitmapContextCreate(NULL, width*imageScale, height*imageScale, 8, 0, colorSpace, (CGBitmapInfo)kCGImageAlphaPremultipliedLast);
    
    [self drawGraphInContext:context];
    
    // Get your image
    CGImageRef cgImage = CGBitmapContextCreateImage(context);

    
    _graphView.image = [[UIImage alloc] initWithCGImage:cgImage];
    
    CGColorSpaceRelease(colorSpace);
    CGContextRelease(context);
    CGImageRelease(cgImage);
}


-(void) drawInContext:(CGContextRef)dstContext fromImage:(CGImageRef)srcImage fromRect:(CGRect)srcRect toRect:(CGRect)dstRect inColor:(CGColorRef)color {
    
    CGFloat imageScale = [[UIScreen mainScreen] scale];
    dstRect.origin.x *= imageScale;
    dstRect.origin.y *= imageScale;
    dstRect.size.width *= imageScale;
    dstRect.size.height *= imageScale;
    
    CGImageRef croppedSrcImage = CGImageCreateWithImageInRect(srcImage, srcRect);
    
    CGContextRef srcContext = CGBitmapContextCreate(NULL, srcRect.size.width, srcRect.size.height, 8, 0, CGImageGetColorSpace(croppedSrcImage), (CGBitmapInfo)CGImageGetAlphaInfo(croppedSrcImage));

    CGContextDrawImage(srcContext, CGRectMake(0.0, 0.0, srcRect.size.width, srcRect.size.height), croppedSrcImage);
    
    //CGContextScaleCTM(srcContext, dstRect.size.width/srcRect.size.width, dstRect.size.height/srcRect.size.height); // does not seem to be needed
    
    CGImageRef finalSrcImage = CGBitmapContextCreateImage(srcContext);

    CGContextSetFillColorWithColor(dstContext, color);
    CGContextSetBlendMode(dstContext, kCGBlendModeNormal);

    CGContextSaveGState(dstContext);
    CGContextDrawImage(dstContext, dstRect, finalSrcImage);
    CGContextClipToMask(dstContext, dstRect, finalSrcImage);
    CGContextAddRect(dstContext, dstRect);
    CGContextDrawPath(dstContext, kCGPathFill);
    CGContextRestoreGState(dstContext);

    CGContextRelease(srcContext);
    CGImageRelease(finalSrcImage);
    CGImageRelease(croppedSrcImage);
}


-(void) drawGraphInContext:(CGContextRef)context {
    NSArray *data = [_delegate getGraphData];
    
    CGFloat width = (CGFloat)_graphView.frame.size.width;
    CGFloat height = (CGFloat)_graphView.frame.size.height;
    
    int nEntries = [data count];
    
    // draw horizontal grid lines
    CGImageRef srcIm = [UIImage imageNamed:@"horizontal_bars_128.png"].CGImage;
    
    float xMargin = 0.05*width;
    float yMargin = 0.05*height;
    float x0 = xMargin;
    float x1 = width - xMargin;
    float xInterval = width - 2*xMargin;
    float yInterval = height - 2*yMargin;
    
    int nGridLines = 5;
    float gridLineThickness = yInterval/25;
    
    for (int i = 0; i < nGridLines; i++) {
        float y0 = yMargin + i*yInterval/(nGridLines-1);
        CGRect dstRect = CGRectMake(x0, y0, x1-x0+1, gridLineThickness);
        
        // randomly select one of the 9 lines
        int lineNumber = rand() % 9;
        float x0_src = 128;
        float x1_src = 14*128;
        float y0_src = lineNumber*128+64;
        CGRect srcRect = CGRectMake(x0_src, y0_src, x1_src-x0_src+1, 128);
        
        CGColorRef color;
        if (i % 2 == 0)
            color = [UIColor blackColor].CGColor;
        else
            color = [UIColor grayColor].CGColor;
        
        [self drawInContext:context fromImage:srcIm fromRect:srcRect toRect:dstRect inColor:color];
    }

    
    // draw vertical bars
    srcIm = [UIImage imageNamed:@"vertical_bars_128.png"].CGImage;
    
    float maxVal = -INFINITY;
    for (int i = 0; i < nEntries; i++) {
        Party *p = (Party*)[data objectAtIndex:i];
        if (p.plusScore > maxVal)
            maxVal = p.plusScore;
        if (p.minusScore > maxVal)
            maxVal = p.minusScore;
    }
    
    for (int i = 0; i < nEntries; i++) {
        Party *p = (Party*)[data objectAtIndex:i];

        float barThickness = xInterval/8;
        float x0 = xMargin + (i+1)*xInterval/(nEntries+1) - barThickness/2;
        float barLength = (p.plusScore + p.minusScore)/(2*maxVal) * yInterval;
        float y0 = yMargin + yInterval/2 - p.minusScore/maxVal*yInterval/2;
        
        CGRect dstRect = CGRectMake(x0, y0, barThickness, barLength);
        
        // randomly select one of the 4 bars
        int barNumber = rand() % 4;
        float x0_src = barNumber*128+64;
        float y0_src = 128;
        float y1_src = 615;
        CGRect srcRect = CGRectMake(x0_src, y0_src, 128, y1_src - y0_src);
        //NSLog(@"color %@", p.color);
        CGColorRef color = [p.color CGColor];

        [self drawInContext:context fromImage:srcIm fromRect:srcRect toRect:dstRect inColor:color];
    }
}

@end
