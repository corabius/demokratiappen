//
//  UserTag.h
//  DemokratiAppen
//
//  Created by Silvia Man on 2014-01-27.
//  Copyright (c) 2014 Joakim Rydell. All rights reserved.
//


#import <Parse/Parse.h>

@interface UserTag : PFObject <PFSubclassing>

@property NSString *name;
@property int *negativeCount;
@property int *positiveCount;
//@property Tag *tag;
//@property User *user;


+ (NSString*) parseClassName;

@end