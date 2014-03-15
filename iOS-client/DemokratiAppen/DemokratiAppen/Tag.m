//
//  Tag.m
//  DemokratiAppen
//
//  Created by Silvia Man on 2014-01-12.
//  Copyright (c) 2014 Demokratiappen
//

#import "Tag.h"
#import <Parse/PFObject+Subclass.h>

@implementation Tag

@dynamic name;
@dynamic type;

+ (NSString*) parseClassName {
    return @"Tag";
}

@end


