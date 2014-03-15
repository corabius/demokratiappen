//
//  UserTag.m
//  DemokratiAppen
//
//  Created by Silvia Man on 2014-01-27.
//  Copyright (c) 2014 Demokratiappen
//


#import "UserTag.h"
#import <Parse/PFObject+Subclass.h>

@implementation UserTag

@dynamic name;
@dynamic negativeCount;
@dynamic positiveCount;


+ (NSString*) parseClassName {
    return @"UserTag";
}

@end