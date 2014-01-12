//
//  UserData.h
//  DemokratiAppen
//
//  Created by Joakim Rydell on 2014-01-11.
//  Copyright (c) 2014 Joakim Rydell. All rights reserved.
//

#import <Foundation/Foundation.h>


@interface UserData : NSObject

@property NSMutableArray *parties;

-(int) getNumURLs;
-(NSString*) getURLAtIndex:(int)index;
-(NSArray*) getPartyData;

@end
