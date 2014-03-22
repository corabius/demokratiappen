//
//  ParseSignUpViewController.m
//  DemokratiAppen
//
//  Created by Kevin Ivan on 10/03/14.
//  Copyright (c) 2014 Joakim Rydell. All rights reserved.
//

#import "ParseSignUpViewController.h"

@interface ParseSignUpViewController ()

@end

@implementation ParseSignUpViewController


- (void)viewDidLoad {
    [super viewDidLoad];
    
    [self.signUpView setBackgroundColor:[UIColor colorWithPatternImage:[UIImage imageNamed:@"background2.png"]]];
    [self.signUpView setLogo:[[UIImageView alloc] initWithImage:[UIImage imageNamed:@"logo3.png"]]];
    
}

@end