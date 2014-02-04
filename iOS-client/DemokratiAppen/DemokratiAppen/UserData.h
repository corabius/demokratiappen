//
//  UserData.h
//  DemokratiAppen
//
//  Created by Joakim Rydell on 2014-01-11.
//  Copyright (c) 2014 Joakim Rydell. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface UserData : NSObject


// These will not change, I think. Change to NSArray?
@property NSMutableArray *partyArray;  //consist of UserTag. TODO: consist of Tag
@property NSMutableArray *pageArray;
@property NSMutableArray *userTagsArray;


+ (UserData*) sharedUserData;
-(void)reloadData: (NSString*)className;

-(int) getNumURLs;
-(NSString*) getURLAtIndex:(int)index;
-(NSString*) getTitleAtIndex:(int)index;


-(int) getNumUserTags;
-(int) getPositiveCount:(int)index;
-(int) getNegativeCount:(int)index;
-(NSString*) getNameAtIndex:(int)index;


-(NSArray*) getPartyData;

@end

static UserData *mySharedUserData = nil;
