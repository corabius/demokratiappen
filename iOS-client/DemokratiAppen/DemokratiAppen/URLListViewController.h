//
//  FirstViewController.h
//  DemokratiAppen
//
//  Created by Joakim Rydell on 2014-01-11.
//  Copyright (c) 2014 Joakim Rydell. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "UserData.h"
//#import <Parse/Parse.h>

@interface FirstViewController : UIViewController  <UITableViewDelegate, UITableViewDataSource>
//@interface FirstViewController : PFQueryTableViewController  <UITableViewDelegate, UITableViewDataSource>


@property (weak, nonatomic) IBOutlet UITableView *urlTableView;

@end
