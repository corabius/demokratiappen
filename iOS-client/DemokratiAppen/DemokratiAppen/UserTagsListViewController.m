//
//  UserTagsViewController.m
//  DemokratiAppen
//
//  Created by Silvia Man on 2014-01-27.
//  Copyright (c) 2014 Demokratiappen
//

#import "UserTagsListViewController.h"
#import "UserData.h"

@interface UserTagsListViewController ()

@end

@implementation UserTagsListViewController


- (id)initWithStyle:(UITableViewStyle)style
{
    self = [super initWithStyle:style];
    if (self) {
        // Custom initialization
    }
    return self;
}


- (void)viewDidLoad
{
    [super viewDidLoad];

    // Uncomment the following line to preserve selection between presentations.
    // self.clearsSelectionOnViewWillAppear = NO;
 
    // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
    //self.navigationItem.rightBarButtonItem = self.editButtonItem;

    //Not needed...
    //[[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(tabBecomeActive:) name:UIApplicationDidBecomeActiveNotification object:nil];

    [[UserData sharedUserData] addObserver:self forKeyPath:@"userTagsArray" options:0 context:nil];

}


- (void)viewDidAppear:(BOOL)animated{

    [super viewDidAppear:animated];

    /*if(firstTime){
     //show it
     firstTime = NO;
     }*/


    [[UserData sharedUserData] reloadData:@"UserTag"];
    [self.tableView reloadData];
}

/*- (void)objectsDidLoad:(NSError *)error {  //if inherit from PFQueryTableViewController
    NSLog(@"inne i objectsDidLoad");
    //[super objectsDidLoad:error];
}*/

/*
 -(void)tabBecomeActive:(NSNotification *)notification {

    // only respond if the selected tab is our current tab
    if (self.tabBarController.selectedIndex == 0) { // Tab 1 is 0 index
        [self viewDidAppear:YES];
    }

 }*/


- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}



#pragma mark - Table view data source

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    // Return the number of sections.
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    //NSLog(@"getNumUserTags %d", [[UserData sharedUserData] getNumUserTags]);
    return [[UserData sharedUserData] getNumUserTags];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{

    static NSString *CellIdentifier = @"UserTagCell";
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier forIndexPath:indexPath];
    
    NSString *name = [[UserData sharedUserData] getNameAtIndex:[indexPath row]];
    int positiveCounts = [[UserData sharedUserData] getPositiveCount:[indexPath row]];
    int negativeCounts = [[UserData sharedUserData] getNegativeCount:[indexPath row]];


    cell.textLabel.text = name;

    cell.detailTextLabel.text = [NSString stringWithFormat:@"+%d / -%d", positiveCounts, negativeCounts];
    
    return cell;
}



/*
// Override to support conditional editing of the table view.
- (BOOL)tableView:(UITableView *)tableView canEditRowAtIndexPath:(NSIndexPath *)indexPath
{
    // Return NO if you do not want the specified item to be editable.
    return YES;
}
*/

/*
// Override to support editing the table view.
- (void)tableView:(UITableView *)tableView commitEditingStyle:(UITableViewCellEditingStyle)editingStyle forRowAtIndexPath:(NSIndexPath *)indexPath
{
    if (editingStyle == UITableViewCellEditingStyleDelete) {
        // Delete the row from the data source
        [tableView deleteRowsAtIndexPaths:@[indexPath] withRowAnimation:UITableViewRowAnimationFade];
    }   
    else if (editingStyle == UITableViewCellEditingStyleInsert) {
        // Create a new instance of the appropriate class, insert it into the array, and add a new row to the table view
    }   
}
*/

/*
// Override to support rearranging the table view.
- (void)tableView:(UITableView *)tableView moveRowAtIndexPath:(NSIndexPath *)fromIndexPath toIndexPath:(NSIndexPath *)toIndexPath
{
}
*/

/*
// Override to support conditional rearranging of the table view.
- (BOOL)tableView:(UITableView *)tableView canMoveRowAtIndexPath:(NSIndexPath *)indexPath
{
    // Return NO if you do not want the item to be re-orderable.
    return YES;
}
*/

/*
#pragma mark - Navigation

// In a story board-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}

 */




-(void) observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context {
    if ([keyPath isEqual:@"userTagsArray"]) {
        [self.tableView reloadData];
    }
}


@end
