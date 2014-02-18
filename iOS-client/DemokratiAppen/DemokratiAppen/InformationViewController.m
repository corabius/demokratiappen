//
//  InformationViewController.m
//  DemokratiAppen
//
//  Created by Silvia Man on 2014-02-10.
//  Copyright (c) 2014 Joakim Rydell. All rights reserved.
//

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

    NSURL* url = [NSURL URLWithString: @"http:www.demokratiappen.se"];
    NSURLRequest* urlRequest = [NSURLRequest requestWithURL: url];
    self.jsBookmarkletWebView.scalesPageToFit = true;
    [self.jsBookmarkletWebView loadRequest: urlRequest];

    self.jsBookmarkletBtn.layer.borderWidth = 1.0f;
    self.jsBookmarkletBtn.layer.borderColor=[[UIColor lightGrayColor] CGColor];
    self.jsBookmarkletBtn.layer.cornerRadius = 7;
    self.jsBookmarkletBtn.layer.masksToBounds = YES;


   }

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)jsBookmarkletAction:(id)sender {

    //copies the booklet-js-code to system clipboard
    [UIPasteboard generalPasteboard].string = @"javascript:function iprl5(){var d=document,l=d.location;document.location=l.protocol+'//demokratiappen.parseapp.com/#/?title='+d.title+'&url='+encodeURIComponent(l.href);}iprl5();void(0)";

    //opens Safari
    //[[UIApplication sharedApplication] openURL:[NSURL URLWithString:@"http:www.demokratiappen.se"]];



}



- (void) prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    if(sender == self.okBtn){
    }
}





@end
