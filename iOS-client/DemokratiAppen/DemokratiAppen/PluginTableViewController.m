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

#import "PluginTableViewController.h"
#import "Plugin.h"
#import "PluginTableViewCell.h"

@interface PluginTableViewController ()


@end

@implementation PluginTableViewController

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
    // self.navigationItem.rightBarButtonItem = self.editButtonItem;

    self.visiualPluginArray = [[NSMutableArray alloc] init];
    self.analyticPluginArray = [[NSMutableArray alloc] init];

    [self createTableViewItems];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

#pragma mark - Table view data source




- (void) createTableViewItems{

    Plugin *plugin1 = [[Plugin alloc] init];
    plugin1.name = @"Alla taggord";
    plugin1.subTitleName = @"Grafstatistik";
    plugin1.publisher = @"Demokratiappen";
    plugin1.pluginIcon = [UIImage imageNamed:@"logo2.png"];
    [self.visiualPluginArray addObject: plugin1];



    Plugin *plugin2 = [[Plugin alloc] init];
    plugin2.name = @"Riksdagspartier";
    plugin2.subTitleName = @"Grafstatistik";
    plugin2.publisher = @"Demokratiappen";
    plugin2.pluginIcon = [UIImage imageNamed:@"vertical_bars_128.png"];
    [self.visiualPluginArray addObject: plugin2];

    Plugin *plugin3 = [[Plugin alloc] init];
    plugin3.name = @"Sakfrågor";
    plugin3.subTitleName = @"Cirkeldiagram";
    plugin3.publisher = @"Demokratiappen";
    plugin3.pluginIcon = [UIImage imageNamed:@"horizontal_bars_128.png"];
    [self.visiualPluginArray addObject: plugin3];

    Plugin *plugin4 = [[Plugin alloc] init];
    plugin4.name = @"Angående utbildning";
    plugin4.subTitleName = @"Följ taggade artiklar";
    plugin4.publisher = @"Mats Kvistgren, opinionsbildare";
    plugin4.pluginIcon = [UIImage imageNamed:@"logo4.png"];
    [self.analyticPluginArray addObject: plugin4];



    Plugin *plugin5 = [[Plugin alloc] init];
    plugin5.name = @"Vilket parti är du?";
    plugin5.subTitleName = @"Analys av dina taggar";
    plugin5.publisher = @"Aftonposten";
    plugin5.pluginIcon = [UIImage imageNamed:@"logo4.png"];
    [self.analyticPluginArray addObject: plugin5];

    Plugin *plugin6 = [[Plugin alloc] init];
    plugin6.name = @"Följ din favoritpolitiker";
    plugin6.subTitleName = @"Visualisering över tid";
    plugin6.publisher = @"Tankesmedjan Tidlös";
    plugin6.pluginIcon = [UIImage imageNamed:@"logo4.png"];
    [self.analyticPluginArray addObject: plugin6];

    Plugin *plugin7 = [[Plugin alloc] init];
    plugin7.name = @"EU-parlamentet";
    plugin7.subTitleName = @"Namnförslag politiker";
    plugin7.publisher = @"Oberoende ungdomspartiet";
    plugin7.pluginIcon = [UIImage imageNamed:@"logo5.png"];
    [self.analyticPluginArray addObject: plugin7];

    Plugin *plugin8 = [[Plugin alloc] init];
    plugin8.name = @"Din viktigaste valfråga";
    plugin8.subTitleName = @"Diagram över sakfrågor";
    plugin8.publisher = @"Departementet för viktiga saker";
    plugin8.pluginIcon = [UIImage imageNamed:@"logo6.png"];
    [self.analyticPluginArray addObject: plugin8];




}


- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView{
    // Return the number of sections.
    return 2;
}

- (NSString *)tableView:(UITableView *)tableView titleForHeaderInSection:(NSInteger)section
{
    NSString *sectionName;
    switch (section)
    {
        case 0:
            sectionName = @"Visuella plugin";
            break;
        case 1:
            sectionName = @"Analytiska plugin";
            break;
        default:
            sectionName = @"Plugin";
            break;
    }
    return sectionName;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
    //Return the number of rows in the section.
    if(section == 0){
        return [self.visiualPluginArray count];
    }
    else if(section == 1){
        return [self.analyticPluginArray count];
    }

    assert(false); // Failsafe. Will break in debug-mode. Will return if in release-mode.
    return 0;
}


- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    
    PluginTableViewCell *pluginCell = [tableView
                                   dequeueReusableCellWithIdentifier:@"pluginCell" forIndexPath:indexPath];
    
    // Configure the cell...

    Plugin *plugin;
    if(indexPath.section ==0){
        plugin = self.visiualPluginArray[indexPath.row];
    }
    else{
        plugin = self.analyticPluginArray[indexPath.row];
    }

    pluginCell.tableViewCellNameLabel.text = plugin.name;
    pluginCell.tableViewCellSubtitleNameLabel.text = plugin.subTitleName;
    pluginCell.tableViewCellPublisherLabel.text = plugin.publisher;
    pluginCell.tableViewCellPluginIcon.image = plugin.pluginIcon;
    
    return pluginCell;
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
    } else if (editingStyle == UITableViewCellEditingStyleInsert) {
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

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
