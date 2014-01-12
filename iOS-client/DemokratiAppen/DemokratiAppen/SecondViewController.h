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

UserData *uData;

@interface SecondViewController : UIViewController <GraphViewControllerDelegate>
@property (weak, nonatomic) IBOutlet UIView *container;
- (IBAction)buttonPressed:(id)sender;
- (NSArray*)getGraphData;
@end
