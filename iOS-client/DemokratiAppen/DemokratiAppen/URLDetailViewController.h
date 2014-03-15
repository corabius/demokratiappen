//
//  URLDetailViewController.h
//  DemokratiAppen
//
//  Created by Joakim Rydell on 2014-01-11.
//  Copyright (c) 2014 Demokratiappen
//

#import <UIKit/UIKit.h>


@interface URLDetailViewController : UIViewController

@property (weak, nonatomic) IBOutlet UILabel *urlLabelOutlet;
@property (strong, nonatomic) NSString *urlDetails;

- (IBAction)openInSafariButtonTapped:(id)sender;

@end
