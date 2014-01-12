//
//  SecondViewController.m
//  DemokratiAppen
//
//  Created by Joakim Rydell on 2014-01-11.
//  Copyright (c) 2014 Joakim Rydell. All rights reserved.
//

#import "PartyGraphViewController.h"
#import "UIGraphViewController.h"

@interface SecondViewController ()

@end

@implementation SecondViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view, typically from a nib.
    
    uData = [[UserData alloc] init];

    UIGraphViewController *viewInsideOfContainer = (UIGraphViewController*)([self childViewControllers].lastObject);
    [viewInsideOfContainer setDelegate:self];
    //[viewInsideOfContainer drawSomething];

}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)buttonPressed:(id)sender {
    UIGraphViewController *viewInsideOfContainer = (UIGraphViewController*)([self childViewControllers].lastObject);
    [viewInsideOfContainer drawSomething];
}

- (NSArray*) getGraphData {
    return [uData getPartyData];
}

@end
