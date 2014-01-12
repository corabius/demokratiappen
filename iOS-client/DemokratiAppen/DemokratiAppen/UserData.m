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
    [_parties addObject:[[Party alloc] initWithName:@"Folkpartiet" acronym:@"FP" plusScore:4 minusScore:0 color:@"0088ff"]];
    [_parties addObject:[[Party alloc] initWithName:@"Centerpartiet" acronym:@"C" plusScore:1 minusScore:2 color:@"00aa00"]];
    [_parties addObject:[[Party alloc] initWithName:@"Miljöpartiet" acronym:@"MP" plusScore:3 minusScore:1 color:@"00ff00"]];

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
