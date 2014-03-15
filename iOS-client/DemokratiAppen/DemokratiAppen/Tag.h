//
//  Tag.h
//  DemokratiAppen
//
//  Created by Silvia Man on 2014-01-12.
//  Copyright (c) 2014 Demokratiappen
//

#import <Parse/Parse.h>

@interface Tag : PFObject <PFSubclassing>

@property NSString *name;
@property NSString *type;

+ (NSString*) parseClassName;

@end
