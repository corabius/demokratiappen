//
//  PluginWebViewController.m
//  DemokratiAppen
//
//  Created by Silvia Man on 2014-03-24.
//  Copyright (c) 2014 Demokratiappen. All rights reserved.
//

#import "PluginWebViewController.h"

@interface PluginWebViewController () <UIWebViewDelegate>
@property (weak, nonatomic) IBOutlet UIWebView *webView;

@end

@implementation PluginWebViewController

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

    NSString *completeURL = @"http://demokratiappen.se";  //TODO: correct link
    NSURL* url = [NSURL URLWithString: completeURL];

    NSURLRequest* urlRequest = [NSURLRequest requestWithURL: url];

    self.webView.delegate = self;
    self.webView.scalesPageToFit = true;
    [self.webView loadRequest: urlRequest];

}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
