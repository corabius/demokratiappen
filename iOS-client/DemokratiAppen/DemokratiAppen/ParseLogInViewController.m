//
//  ParseLogInViewController.m
//  DemokratiAppen
//
//  Created by Kevin Ivan on 10/03/14.
//  Copyright (c) 2014 Joakim Rydell. All rights reserved.
//

#import "ParseLogInViewController.h"

@interface ParseLogInViewController ()

@property (nonatomic, strong) UIImageView *fieldsBackground;
@end

@implementation ParseLogInViewController

@synthesize fieldsBackground;

- (void)viewDidLoad {
    [super viewDidLoad];
    
    [self.logInView setBackgroundColor:[UIColor colorWithPatternImage:[UIImage imageNamed:@"background.png"]]];
    //[self.logInView setLogo:[[UIImageView alloc] initWithImage:[UIImage imageNamed:@"Logo.png"]]];

}

- (void)viewDidLayoutSubviews {
    [super viewDidLayoutSubviews];
    
    [self.fieldsBackground setFrame:CGRectMake(35.0f, 145.0f, 250.0f, 100.0f)];
}
 

@end