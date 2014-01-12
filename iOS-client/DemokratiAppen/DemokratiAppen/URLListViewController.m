//
//  FirstViewController.m
//  DemokratiAppen
//
//  Created by Joakim Rydell on 2014-01-11.
//  Copyright (c) 2014 Joakim Rydell. All rights reserved.
//

#import "URLListViewController.h"
#import "URLDetailViewController.h"

@interface FirstViewController ()

@end

@implementation FirstViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view, typically from a nib.
    
    uData = [[UserData alloc] init]; // TODO: store in NSUserDefaults
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (NSInteger) numberOfSectionsInTableView:(UITableView *)tableView {
    return 1;
}

- (NSInteger) tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return [uData getNumURLs];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    static NSString *MyIdentifier = @"MyReuseIdentifier";
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:MyIdentifier];
    if (cell == nil) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:MyIdentifier];
    }
    
    NSString *text = [uData getURLAtIndex:[indexPath row]];
    cell.textLabel.text = text;
    
    return cell;
}

-(void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    if ([[segue identifier] isEqualToString:@"ShowURLDetails"]) {
        URLDetailViewController *detailViewController = [segue destinationViewController];
        
        NSIndexPath *myIndexPath = [self.urlTableView indexPathForSelectedRow];
        long row = [myIndexPath row];
        
        detailViewController.urlDetails = [uData getURLAtIndex:row];
    }
}

@end
