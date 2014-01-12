//
//  UserData.m
//  DemokratiAppen
//
//  Created by Joakim Rydell on 2014-01-11.
//  Copyright (c) 2014 Joakim Rydell. All rights reserved.
//

#import "UserData.h"
#import "Party.h"
#import <Parse/Parse.h>
#import "Tag.h"
#import "Page.h"

@implementation UserData




-(id) init {
    self = [super init];

    _partyArray = [[NSMutableArray alloc] init];
    [self populatePartyArray];

    [self createAllPageQuery];

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
    return [NSArray arrayWithArray:_partyArray];
}


- (void) createAllPageQuery{

//TODO: antagligen behöva ta ut alla url:er och sedan plocka ut taggarna i loop. Spara i NSDefaults.
    PFQuery* allPageQuery = [Page query] ;

    //Tag *socialdemokraterna = [query whereKey:@"name" equalTo:@"Socialdemokraterna"];



    //[allQuery orderByAscending:@"name"];

//TODO: find out why making so many requests?!
    allPageQuery.trace = true;

    [allPageQuery findObjectsInBackgroundWithBlock:^(NSArray *objects, NSError *error) {

        if (error == nil) {
            self.partyArray = [NSMutableArray arrayWithArray:objects];
            //[self.tableView reloadData];
        }
        else {
            UIAlertView* alert = [[UIAlertView alloc] initWithTitle:@"Tillfälligt Avbrott" message:@"Ingen förbindelse" delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil];
            
            [alert show];
        }
        
    }];
    
    
}

- (void) populatePartyArray{

    [_partyArray addObject:[[Party alloc] initWithName:@"Socialdemokraterna" acronym:@"S" plusScore:4 minusScore:2 color:@"ff0000"]];
    [_partyArray addObject:[[Party alloc] initWithName:@"Moderaterna" acronym:@"M" plusScore:2 minusScore:3 color:@"0000aa"]];
    [_partyArray addObject:[[Party alloc] initWithName:@"Folkpartiet" acronym:@"FP" plusScore:4 minusScore:0 color:@"0088ff"]];
    [_partyArray addObject:[[Party alloc] initWithName:@"Centerpartiet" acronym:@"C" plusScore:1 minusScore:2 color:@"00aa00"]];
    [_partyArray addObject:[[Party alloc] initWithName:@"Miljöpartiet" acronym:@"MP" plusScore:3 minusScore:1 color:@"00ff00"]];
}




@end
