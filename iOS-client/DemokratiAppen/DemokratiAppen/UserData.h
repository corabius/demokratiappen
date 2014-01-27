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
@property NSMutableArray *partyArray;
@property NSMutableArray *pageArray;
@property NSMutableArray *userTagsArray;


+ (UserData*) sharedUserData;

-(int) getNumURLs;
-(int) getNumUserTags;
-(NSString*) getURLAtIndex:(int)index;
-(NSString*) getTitleAtIndex:(int)index;
-(NSArray*) getPartyData;

@end

static UserData *mySharedUserData = nil;
