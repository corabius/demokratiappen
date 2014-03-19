//
//  ParseConfigViewController.h
//  DemokratiAppen
//
//  Created by Kevin Ivan on 10/03/14.
//  Copyright (c) 2014 Joakim Rydell. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import <Parse/Parse.h>
#import "PageContentViewController.h"

@interface ParseConfigViewController : UIViewController <PFLogInViewControllerDelegate, PFSignUpViewControllerDelegate, UIPageViewControllerDataSource>

@property (nonatomic, strong) IBOutlet UILabel *welcomeLabel;

- (IBAction)startWalkthrough:(id)sender;
@property (strong, nonatomic) UIPageViewController *pageViewController;
@property (strong, nonatomic) NSArray *pageTitles;
@property (strong, nonatomic) NSArray *pageImages;

@end
