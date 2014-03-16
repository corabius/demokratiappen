//
//  PluginTableViewCell.m
//  DemokratiAppen
//
//  Created by Silvia Man on 2014-03-16.
//  Copyright (c) 2014 Demokratiappen
//

#import "PluginTableViewCell.h"

@interface PluginTableViewCell ()



@end



@implementation PluginTableViewCell

- (id)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self) {
        // Initialization code
    }
    return self;
}

- (void)awakeFromNib
{
    // Initialization code
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated
{
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}

@end
