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

#import "LoginViewController.h"
#import "InformationViewController.h"
#import "ParseConfigViewController.h"
#import <Parse/Parse.h>
#import <MessageUI/MessageUI.h>


//@interface LoginViewController () <PFLogInViewControllerDelegate, MFMailComposeViewControllerDelegate>

@interface LoginViewController () <MFMailComposeViewControllerDelegate>

@property PFLogInViewController* parseLoginController;  //jag blir delegerad till från PF-login-kod

@property (weak, nonatomic) IBOutlet UIButton *loginFBBtn;
@property (weak, nonatomic) IBOutlet UIButton *logoutFBBtn;
@property (weak, nonatomic) IBOutlet UILabel *userFBLabel;

@property (weak, nonatomic) IBOutlet UIButton *loginAccountBtn;
@property (weak, nonatomic) IBOutlet UIButton *logoutAccountBtn;
@property (weak, nonatomic) IBOutlet UILabel *userAccountLabel;

@property (weak, nonatomic) IBOutlet UITextView *instructionsTextView;
@property (weak, nonatomic) IBOutlet UIButton *openParseAccountBtn;
@property (weak, nonatomic) IBOutlet UIButton *emailContactPersonBtn;
@property (weak, nonatomic) IBOutlet UIButton *emailDemokratiappenBtn;


- (IBAction)openInSafariAction:(id)sender;
- (IBAction)sendEmailAction:(id)sender;

- (IBAction)sendToFBAction:(id)sender;

- (IBAction)sendToDemokratiappenWebbAction:(id)sender;

- (IBAction)sendToGitHubAction:(id)sender;

//- (IBAction)loginFBAction:(id)sender;
- (IBAction)logoutFBAction:(id)sender;
- (IBAction)loginAccountAction:(id)sender;
- (IBAction)logoutAccountAction:(id)sender;


@property (weak, nonatomic) IBOutlet UIButton *testBtn;

- (IBAction)testBtnAction:(id)sender;


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

    //self.userAccountLabel.text = @"Ej inloggad";
    [self updateCurrentUser];

    NSString *text1 = @"\nAnvänd samma testkonto som du skapar för både appen och webbgränssnittet. \n";
    NSString *text2 = @"\nDemokratiappen är under utveckling. Databasen med användare kommer då och då att tömmas. Räkna inte med att spara ner något och sen återfinna det. Observera också att vi ännu inte lagt på något säkerhetslager så vi kan i nuläget öppet se alla dina taggmarkeringar.";
    NSString *text3 = @"\n\nMejla gärna och ge oss feedback!";
    NSString *text4 = @"Du kan också ta kontakt med en av våra projektledare: Adam Svensson, 070 - 603 12 53";

    self.instructionsTextView.text = [NSString stringWithFormat:@"%@ %@ %@ %@", text1, text2, text3, text4];
    self.instructionsTextView.editable = false;

     [self.instructionsTextView flashScrollIndicators];  //not possible to always show scrollbar. can only flash once to show indication

    self.testBtn.hidden = true;
}


-(void)viewDidAppear:(BOOL)animated{

    [super viewDidAppear:true];
    [self updateCurrentUser];

}


- (void) updateCurrentUser{

    PFUser* user = [PFUser currentUser];

    BOOL fbConnection = false;

    if(fbConnection == true){
        if(user != nil){
            //fbConnection = [PFFacebookUtils isLinkedWithUser: user];
            self.userFBLabel.text = user.username;

            self.userFBLabel.hidden = false;
            self.logoutFBBtn.hidden = false;
            self.loginFBBtn.hidden = true;

        }

        else{
            self.userFBLabel.hidden = true;
            self.logoutFBBtn.hidden = true;
            self.loginFBBtn.hidden = false;
            
        }

    }
    else{  //login parse-account
        if(user != nil){
            //fbConnection = [PFFacebookUtils isLinkedWithUser: user];
            self.userAccountLabel.text = user.username;

            self.userAccountLabel.hidden = false;
            self.logoutAccountBtn.hidden = false;
            self.loginAccountBtn.hidden = true;

        }

        else{
            self.userAccountLabel.text = @"Ej inloggad";
            //self.userAccountLabel.hidden = true;
            
            self.logoutAccountBtn.hidden = true;
            self.loginAccountBtn.hidden = false;
            
        }

    }



    }


- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}


- (IBAction)openInSafariAction:(id)sender {

    if([sender tag] == 10){
        [[UIApplication sharedApplication] openURL:[NSURL URLWithString:@"http://demokratiappen.parseapp.com"]];
    }


}

- (IBAction)sendEmailAction:(id)sender {

    MFMailComposeViewController *mailComposer = [[MFMailComposeViewController alloc] init];
    mailComposer.mailComposeDelegate = self;

    [mailComposer setToRecipients:[NSArray arrayWithObjects: ((UIButton*)sender).currentTitle,nil]];

    [self presentViewController:mailComposer animated:YES completion:nil];
}

- (void)mailComposeController:(MFMailComposeViewController *)controller didFinishWithResult:(MFMailComposeResult)result error:(NSError *)error{

    [self dismissViewControllerAnimated:YES completion:nil];
}

- (IBAction)sendToFBAction:(id)sender {

    NSURL *url = [NSURL URLWithString:@"fb://profile/744880375539876"];  //to fb-group: demokratiappen
    [[UIApplication sharedApplication] openURL:url];
}

- (IBAction)sendToDemokratiappenWebbAction:(id)sender {

    NSURL *url = [NSURL URLWithString:@"http://demokratiappen.se"];
    [[UIApplication sharedApplication] openURL:url];
}

- (IBAction)sendToGitHubAction:(id)sender {

    NSURL *url = [NSURL URLWithString:@"https://github.com/corabius/demokratiappen"];
    [[UIApplication sharedApplication] openURL:url];
}



#pragma mark Login/Logout

//- (IBAction)loginFBAction:(id)sender {
//
//    PFUser* user = [PFUser currentUser];
//
//
//    if(user == nil){  //login (and create if not excist) user linked to their facebook-account
//
//        /*
//         User's public profile and also their friend list. Public profile refers to the following properties by default: id, name, first_name, last_name, link, username, gender, locale, age_range, Other public information
//         */
//        NSArray *facebookPermissions = [[NSArray alloc] initWithObjects: @"email", nil];
//
//
//        self.parseLoginController = [[PFLogInViewController alloc] init];
//        self.parseLoginController.delegate = self;
//        self.parseLoginController.facebookPermissions = facebookPermissions;
//
//        /*
//         A bitmask specifying the log in elements which are enabled in the view : for the property PFLogInFields fields
//         enum {
//         PFLogInFieldsNone = 0,
//         PFLogInFieldsUsernameAndPassword = 1 << 0,
//         PFLogInFieldsPasswordForgotten = 1 << 1,
//         PFLogInFieldsLogInButton = 1 << 2,
//         PFLogInFieldsFacebook = 1 << 3,
//         PFLogInFieldsTwitter = 1 << 4,
//         PFLogInFieldsSignUpButton = 1 << 5,
//         PFLogInFieldsDismissButton = 1 << 6,
//         PFLogInFieldsDefault = PFLogInFieldsUsernameAndPassword | PFLogInFieldsLogInButton | PFLogInFieldsSignUpButton | PFLogInFieldsPasswordForgotten | PFLogInFieldsDismissButton
//         };
//         */
//
//        [self updateUserNameAndEmailFromFacebook: user];
//
//        self.parseLoginController.fields = PFLogInFieldsFacebook | PFLogInFieldsDismissButton;
//
//        [self presentViewController: self.parseLoginController animated:YES completion:nil];
//
//        [self updateCurrentUser];
//
//    }

/*
    else{ //user is loggedin
        [self performSegueWithIdentifier:@"NewCommentSeque" sender:self];
    }
*/
//}

- (IBAction)logoutFBAction:(id)sender {

    [PFUser logOut];
    [self updateCurrentUser];
}


- (IBAction)loginAccountAction:(id)sender {

    //tutorial custom login-view https://parse.com/tutorials/login-and-signup-views
    
    /*
    
    self.parseLoginController = [[PFLogInViewController alloc] init];
    
    self.parseLoginController.delegate = self;
    
    [self presentViewController: self.parseLoginController animated:YES completion:nil];

     */
    
    
    

}

- (IBAction)logoutAccountAction:(id)sender {
    [PFUser logOut];
    [self updateCurrentUser];
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




#pragma mark - Navigation

// In a story board-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.

    if ([segue.identifier isEqualToString:@"InformationSeque"]){
    }
    
    if ([segue.identifier isEqualToString:@"ParseLogInViewControllerSegue"]){
    }

}


- (IBAction)unwindController:(UIStoryboardSegue*)sender{

    UIViewController* sourceViewController = sender.sourceViewController;

    if ([sourceViewController isKindOfClass:[InformationViewController class]]){
    }
    
    if ([sourceViewController isKindOfClass:[ParseConfigViewController class]]){
        //[self updateCurrentUser];
    }

}





- (IBAction)testBtnAction:(id)sender {

    NSLog(@"inne i testBtnAction");

    //Using Custom URL Scheme to Launch Application
    //[[UIApplication sharedApplication] openURL:[NSURL URLWithString:@"demokratiappen://test_page/one?token=12345&domain=foo.com"]];

}

@end
