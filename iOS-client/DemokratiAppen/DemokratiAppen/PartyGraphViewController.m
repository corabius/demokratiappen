//
//  SecondViewController.m
//  DemokratiAppen
//
//  Created by Joakim Rydell on 2014-01-11.
//  Copyright (c) 2014 Demokratiappen
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
    
    UIGraphViewController *viewInsideOfContainer = (UIGraphViewController*)([self childViewControllers].lastObject);
    [viewInsideOfContainer setDelegate:self];

    [[UserData sharedUserData] addObserver:self forKeyPath:@"partyArray" options:0 context:nil];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}


- (NSArray*) getGraphData {
    return [[UserData sharedUserData] getPartyData];
}






@end
