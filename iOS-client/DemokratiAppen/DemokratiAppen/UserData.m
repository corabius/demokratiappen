//
//  UserData.m
//  DemokratiAppen
//
//  Created by Joakim Rydell on 2014-01-11.
//  Copyright (c) 2014 Joakim Rydell. All rights reserved.
//

#import "UserData.h"
#import "Party.h"

@implementation UserData

-(id) init {
    self = [super init];
    
    _parties = [[NSMutableArray alloc] init];
    [_parties addObject:[[Party alloc] initWithName:@"Socialdemokraterna" acronym:@"S" plusScore:4 minusScore:2 color:@"ff0000"]];
    [_parties addObject:[[Party alloc] initWithName:@"Moderaterna" acronym:@"M" plusScore:2 minusScore:3 color:@"0000aa"]];

    return self;
}

-(int) getNumURLs {
    return 5;
}

-(NSString*) getURLAtIndex:(int)index {
    if (index == 0)
        return @"http://www.google.com/";
    else
        return [NSString stringWithFormat:@"http://url/%d", index];
}

-(NSArray*) getPartyData {
    return [NSArray arrayWithArray:_parties];
}



@end
