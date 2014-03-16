//
//  PluginTableViewCell.h
//  DemokratiAppen
//
//  Created by Silvia Man on 2014-03-16.
//  Copyright (c) 2014 Demokratiappen
//

#import <UIKit/UIKit.h>

@interface PluginTableViewCell : UITableViewCell

@property (weak, nonatomic) IBOutlet UILabel *tableViewCellNameLabel;
@property (weak, nonatomic) IBOutlet UILabel *tableViewCellSubtitleNameLabel;
@property (weak, nonatomic) IBOutlet UILabel *tableViewCellPublisherLabel;
@property (weak, nonatomic) IBOutlet UIImageView *tableViewCellPluginIcon;

@end
