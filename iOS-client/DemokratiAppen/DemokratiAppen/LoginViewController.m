//
//  LoginViewController.m
//  DemokratiAppen
//
//  Created by Silvia Man on 2014-01-12.
//  Copyright (c) 2014 Joakim Rydell. All rights reserved.
//

#import "LoginViewController.h"
#import <Parse/Parse.h>


@interface LoginViewController () <PFLogInViewControllerDelegate>

@property PFLogInViewController* parseLoginController;  //jag blir delegerad till från PF-login-kod

@property (weak, nonatomic) IBOutlet UIButton *loginBtn;

- (IBAction)loginAction:(id)sender;

@end

@implementation LoginViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];

    [self updateCurrentUser];
}


- (void) updateCurrentUser{
/*
    PFUser* user = [PFUser currentUser];
    
    //BOOL fbConnection = NO;

    if(user != nil){
        //fbConnection = [PFFacebookUtils isLinkedWithUser: user];
        //[self updateUserNameAndEmailFromFacebook: user];
        self.currentUserLabel.text = user.username;

        self.currentUserLabel.hidden = false;
        self.logoutButton.hidden = false;

    }

    else{
        //self.currentUserLabel.text = @"User: not logged in";
        self.currentUserLabel.hidden = true;
        self.logoutButton.hidden = true;

    }

    //self.aboutToCommentAfterLogin = false;
 */
}


- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)loginAction:(id)sender {
    
}
@end
