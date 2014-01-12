//
//  UIGraphViewController.m
//  DemokratiAppen
//
//  Created by Joakim Rydell on 2014-01-11.
//  Copyright (c) 2014 Joakim Rydell. All rights reserved.
//

#import "UIGraphViewController.h"

@interface UIGraphViewController ()

@end

@implementation UIGraphViewController

- (id)initWithCoder:(NSCoder *)aDecoder
{
    self = [super initWithNibName:@"UIGraphView" bundle:[NSBundle mainBundle]];                                            
    printf("Loaded view\n");
    
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];

    //[self drawSomething];
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
    
    CGContextSetRGBFillColor(context, (CGFloat)0.0, (CGFloat)1.0, (CGFloat)0.0, (CGFloat)1.0 );
    CGContextFillRect(context, CGRectMake(0.0, 0.0, width*imageScale, height*imageScale));
    
    
    CGImageRef srcIm = [UIImage imageNamed:@"horizontal_bars_128.png"].CGImage;
    CGRect srcRect = CGRectMake(0, 0, 500, 500);
    CGRect dstRect = CGRectMake(50, 120, 100, 100);

//    [self drawInContext:context fromImage:srcIm fromRect:srcRect toRect:dstRect inColor:[UIColor redColor].CGColor];

    
    [self drawGraphInContext:context];
    
    // Get your image
    CGImageRef cgImage = CGBitmapContextCreateImage(context);

    
    _graphView.image = [[UIImage alloc] initWithCGImage:cgImage];
    
    CGColorSpaceRelease(colorSpace);
    CGContextRelease(context);
    CGImageRelease(cgImage);
    
    // TODO: some more releasing of stuff!
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
    // TODO: some more releasing of stuff!
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
        float y1 = y0 + gridLineThickness;
        CGRect dstRect = CGRectMake(x0, y0, x1-x0+1, gridLineThickness);
        
        // randomly select one of the 9 lines
        int lineNumber = rand() % 9;
        float x0_src = 128;
        float x1_src = 14*128;
        float y0_src = lineNumber*128+64;
        float y1_src = y1_src+128;
        CGRect srcRect = CGRectMake(x0_src, y0_src, x1_src-x0_src+1, 128);
        
        CGColorRef color;
        if (i % 2 == 0)
            color = [UIColor blackColor].CGColor;
        else
            color = [UIColor grayColor].CGColor;
        
        [self drawInContext:context fromImage:srcIm fromRect:srcRect toRect:dstRect inColor:color];
    }
    
}

@end
