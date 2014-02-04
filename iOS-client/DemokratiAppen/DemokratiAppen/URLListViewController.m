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

    [[UserData sharedUserData] addObserver:self forKeyPath:@"pageArray" options:0 context:nil];
    
}

- (void)viewDidAppear:(BOOL)animated{

    [super viewDidAppear:animated];

    [[UserData sharedUserData] reloadData:@"Page"];
    [self.urlTableView reloadData];
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
    return [[UserData sharedUserData] getNumURLs];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    static NSString *MyIdentifier = @"MyReuseIdentifier";
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:MyIdentifier];
    if (cell == nil) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:MyIdentifier];
    }

    NSString *title = [[UserData sharedUserData] getTitleAtIndex:[indexPath row]];
    NSString *url = [[UserData sharedUserData] getURLAtIndex:[indexPath row]];

    cell.textLabel.text = title;
    cell.detailTextLabel.text = url;
    
    return cell;
}

-(void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    if ([[segue identifier] isEqualToString:@"ShowURLDetails"]) {
        URLDetailViewController *detailViewController = [segue destinationViewController];
        
        NSIndexPath *myIndexPath = [self.urlTableView indexPathForSelectedRow];
        long row = [myIndexPath row];
        
        detailViewController.urlDetails = [[UserData sharedUserData] getURLAtIndex:row];
    }
}

-(void) observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context {
    if ([keyPath isEqual:@"pageArray"]) {
        [_urlTableView reloadData];
    }
}


@end
