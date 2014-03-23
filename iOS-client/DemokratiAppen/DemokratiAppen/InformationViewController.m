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

#import "InformationViewController.h"
#import <QuartzCore/QuartzCore.h>

@interface InformationViewController ()


@property (weak, nonatomic) IBOutlet UIButton *jsBookmarkletBtn;
@property (weak, nonatomic) IBOutlet UIWebView *jsBookmarkletWebView;
@property (weak, nonatomic) IBOutlet UIButton *okBtn;

- (IBAction)jsBookmarkletAction:(id)sender;


@end

@implementation InformationViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad{
    [super viewDidLoad];

    NSURL* url = [NSURL URLWithString: @"http://www.demokratiappen.se/support/hur-man-sparar-en-lank/ios"];
    NSURLRequest* urlRequest = [NSURLRequest requestWithURL: url];
    self.jsBookmarkletWebView.scalesPageToFit = true;
    [self.jsBookmarkletWebView loadRequest: urlRequest];

    self.jsBookmarkletBtn.layer.borderWidth = 1.0f;
    self.jsBookmarkletBtn.layer.borderColor=[[UIColor lightGrayColor] CGColor];
    self.jsBookmarkletBtn.layer.cornerRadius = 7;
    self.jsBookmarkletBtn.layer.masksToBounds = YES;

    self.jsBookmarkletBtn.titleLabel.lineBreakMode = NSLineBreakByWordWrapping;
    //[self.jsBookmarkletBtn setTitle: @"Line1\nLine2" forState: UIControlStateNormal];

   }

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)jsBookmarkletAction:(id)sender {

    [self jsBookmarkletCodeSnippet];
    //opens Safari
    //[[UIApplication sharedApplication] openURL:[NSURL URLWithString:@"http:www.demokratiappen.se"]];
}


-(void) jsBookmarkletCodeSnippet{

    //copies the booklet-js-code to system clipboard
    //[UIPasteboard generalPasteboard].string = @"javascript:function iprl5(){var d=document,l=d.location;document.location=l.protocol+'//demokratiappen.parseapp.com/#/?title='+d.title+'&url='+encodeURIComponent(l.href);}iprl5();void(0)";

    [UIPasteboard generalPasteboard].string = @"javascript:function dar1(){var e=document,t,n=e.body,r=e.location;try{if(!n)throw 0;e.title='(Saving...) '+e.title;t=e.createElement('script');t.setAttribute('src',r.protocol+'//demokratiappen.parseapp.com/scripts/Scrape.js');n.appendChild(t)}catch(i){alert('Please wait until the page has loaded.')}}dar1();void(0)";
}


- (void) prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    if(sender == self.okBtn){
        [self jsBookmarkletCodeSnippet];
    }
}





@end
