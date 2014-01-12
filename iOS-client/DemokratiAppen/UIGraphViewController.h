//
//  UIGraphViewController.h
//  DemokratiAppen
//
//  Created by Joakim Rydell on 2014-01-11.
//  Copyright (c) 2014 Joakim Rydell. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "UIGraphViewController.h"

@protocol GraphViewControllerDelegate
- (NSArray*) getGraphData;
@end


@interface UIGraphViewController : UIViewController

@property (strong, nonatomic) IBOutlet UIView *view;
@property (weak, nonatomic) IBOutlet UIImageView *graphView;
@property (weak) id <GraphViewControllerDelegate> delegate;

- (void) drawSomething;
- (void) drawInContext:(CGContextRef)dstContext fromImage:(CGImageRef)srcIm fromRect:(CGRect)srcRect toRect:(CGRect)dstRect inColor:(CGColorRef)color;
-(void) drawGraphInContext:(CGContextRef)context;
-(void) setDelegate:(id <GraphViewControllerDelegate>)newDelagate;

@end
