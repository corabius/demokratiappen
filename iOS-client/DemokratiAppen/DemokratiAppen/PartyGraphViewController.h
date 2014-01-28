//
//  SecondViewController.h
//  DemokratiAppen
//
//  Created by Joakim Rydell on 2014-01-11.
//  Copyright (c) 2014 Joakim Rydell. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "UserData.h"
#import "UIGraphViewController.h"

@interface SecondViewController : UIViewController <GraphViewControllerDelegate>

@property (weak, nonatomic) IBOutlet UIView *container;
@property (weak, nonatomic) IBOutlet UIView *acronymView;

- (NSArray*)getGraphData;

@end
