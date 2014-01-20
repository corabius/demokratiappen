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

@property (weak, nonatomic) IBOutlet UIButton *loginFBBtn;
@property (weak, nonatomic) IBOutlet UIButton *logoutFBBtn;
@property (weak, nonatomic) IBOutlet UILabel *userFBLabel;

@property (weak, nonatomic) IBOutlet UIButton *loginAccountBtn;
@property (weak, nonatomic) IBOutlet UIButton *logoutAccountBtn;
@property (weak, nonatomic) IBOutlet UILabel *userAccountLabel;


- (IBAction)loginAction:(id)sender;
- (IBAction)logoutAction:(id)sender;

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

    PFUser* user = [PFUser currentUser];
    
    //BOOL fbConnection = NO;

    if(user != nil){
        //fbConnection = [PFFacebookUtils isLinkedWithUser: user];
        self.userLabel.text = user.username;

        self.userLabel.hidden = false;
        self.logoutBtn.hidden = false;
        self.loginBtn.hidden = true;

    }

    else{
        self.userLabel.hidden = true;
        self.logoutBtn.hidden = true;
        self.loginBtn.hidden = false;

    }
}


- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}


- (IBAction)loginAction:(id)sender {

    PFUser* user = [PFUser currentUser];


    if(user == nil){  //login (and create if not excist) user linked to their facebook-account

        /*
         User's public profile and also their friend list. Public profile refers to the following properties by default: id, name, first_name, last_name, link, username, gender, locale, age_range, Other public information
         */
        NSArray *facebookPermissions = [[NSArray alloc] initWithObjects: @"email", nil];


        self.parseLoginController = [[PFLogInViewController alloc] init];
        self.parseLoginController.delegate = self;
        self.parseLoginController.facebookPermissions = facebookPermissions;

        /*
         A bitmask specifying the log in elements which are enabled in the view : for the property PFLogInFields fields
         enum {
         PFLogInFieldsNone = 0,
         PFLogInFieldsUsernameAndPassword = 1 << 0,
         PFLogInFieldsPasswordForgotten = 1 << 1,
         PFLogInFieldsLogInButton = 1 << 2,
         PFLogInFieldsFacebook = 1 << 3,
         PFLogInFieldsTwitter = 1 << 4,
         PFLogInFieldsSignUpButton = 1 << 5,
         PFLogInFieldsDismissButton = 1 << 6,
         PFLogInFieldsDefault = PFLogInFieldsUsernameAndPassword | PFLogInFieldsLogInButton | PFLogInFieldsSignUpButton | PFLogInFieldsPasswordForgotten | PFLogInFieldsDismissButton
         };
         */

        [self updateUserNameAndEmailFromFacebook: user];

        self.parseLoginController.fields = PFLogInFieldsFacebook | PFLogInFieldsDismissButton;

        [self presentViewController: self.parseLoginController animated:YES completion:nil];

        [self updateCurrentUser];

    }

/*
    else{ //user is loggedin
        [self performSegueWithIdentifier:@"NewCommentSeque" sender:self];
    }
*/
}


- (void)logInViewController:(PFLogInViewController *)logInController didLogInUser:(PFUser *)user{

    [self dismissViewControllerAnimated:YES completion:nil];
    [self updateUserNameAndEmailFromFacebook: user];
    [self updateCurrentUser];
}


- (void)logInViewControllerDidCancelLogIn:(PFLogInViewController *)logInController{
    [self dismissViewControllerAnimated:YES completion:nil];
}


- (void)updateUserNameAndEmailFromFacebook: (PFUser*) user{

    [FBRequestConnection startForMeWithCompletionHandler:^(FBRequestConnection *connection, id result, NSError *error) {
        if (!error) {
            user.username = [result objectForKey:@"username"];
            user.email = [result objectForKey:@"email"];
            [user saveInBackground];
            //[user saveEventually];
            [self updateCurrentUser];
        }
        else
        {
            //            id alert = [[UIAlertView alloc] initWithTitle: @"Varning"
            //                                                  message: error.userInfo[@"error"]
            //                                                 delegate: nil
            //                                        cancelButtonTitle: @"OK"
            //                                        otherButtonTitles: nil];
            //            [alert show];
        }
    }];
}



- (IBAction)logoutAction:(id)sender {

    [PFUser logOut];
    [self updateCurrentUser];
}
@end
