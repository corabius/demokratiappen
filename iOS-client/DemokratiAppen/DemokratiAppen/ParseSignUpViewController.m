/* Copyright (C) 2014 Demokratiappen.
 *
 * This file is part of Demokratiappen.
 *
 * Demokratiappen is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Demokratiappen is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Demokratiappen.  If not, see <http://www.gnu.org/licenses/>.
 */

#import "ParseSignUpViewController.h"

@interface ParseSignUpViewController ()

@end

@implementation ParseSignUpViewController


- (void)viewDidLoad {
    [super viewDidLoad];
    
    [self.signUpView setBackgroundColor:[UIColor colorWithPatternImage:[UIImage imageNamed:@"background2.png"]]];
    [self.signUpView setLogo:[[UIImageView alloc] initWithImage:[UIImage imageNamed:@"logo3.png"]]];
    
    // Remove text shadow
    CALayer *layer = self.signUpView.usernameField.layer;
    layer.shadowOpacity = 0.0;
    layer = self.signUpView.passwordField.layer;
    layer.shadowOpacity = 0.0;
    layer = self.signUpView.emailField.layer;
    layer.shadowOpacity = 0.0;
    
    // Set field text color
    [self.signUpView.usernameField setTextColor:[UIColor colorWithRed:0.0f/0.0f green:0.0f/0.0f blue:0.0f/0.0f alpha:1.0]];
    [self.signUpView.passwordField setTextColor:[UIColor colorWithRed:0.0f/0.0f green:0.0f/0.0f blue:0.0f/0.0f alpha:1.0]];
    [self.signUpView.emailField setTextColor:[UIColor colorWithRed:0.0f/0.0f green:0.0f/0.0f blue:0.0f/0.0f alpha:1.0]];

    
}

@end
