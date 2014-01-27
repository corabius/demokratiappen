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
#import "UserTag.h"
#import "Page.h"

@implementation UserData

// Does the pragma thing do anything? (-> Yes, click on the purple-c-symbol on top of this page to see all methods collected under the mark)
#pragma mark Singleton Methods

// returns a singleton with all needed user data
+ (UserData*) sharedUserData {
    @synchronized(self) {
        if (mySharedUserData == nil) {
            mySharedUserData = [[self alloc] init];
        }
    }
    return mySharedUserData;
}


-(id) init {
    self = [super init];

    _partyArray = [[NSMutableArray alloc] init];
    [self populatePartyArray];

    [self queryAllTagsAndPages];
    [self queryAllUserTags];
    [self queryAllPages];
    
    return self;
}


-(int) getNumURLs {
    return [_pageArray count];
}
-(NSString*) getURLAtIndex:(int)index {
    Page *page = (Page*)[_pageArray objectAtIndex:index];
    return page.url;
}
-(NSString*) getTitleAtIndex:(int)index {
    Page *page = (Page*)[_pageArray objectAtIndex:index];
    return page.title;
}



-(int) getNumUserTags {
    return [_userTagsArray count];
}
-(NSString*) getNameAtIndex:(int)index {
    UserTag *userTag = (UserTag*)[_userTagsArray objectAtIndex:index];
    return userTag.name;
}
-(int) getPositiveCount:(int)index{
    UserTag *userTag = (UserTag*)[_userTagsArray objectAtIndex:index];
    return userTag.positiveCount;
}
-(int) getNegativeCount:(int)index{
    UserTag *userTag = (UserTag*)[_userTagsArray objectAtIndex:index];
    return userTag.negativeCount;
}



-(NSArray*) getPartyData {
    return [NSArray arrayWithArray:_partyArray];
}


- (void) networkError {
    UIAlertView* alert = [[UIAlertView alloc] initWithTitle:@"Tillfälligt Avbrott" message:@"Ingen förbindelse" delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil];
    
    [alert show];
}


- (void) queryAllPages {

    PFUser* user = [PFUser currentUser];

    PFQuery *allPagesQuery = [Page query];
    [allPagesQuery findObjectsInBackgroundWithBlock:^(NSArray *objects, NSError *error) {
        if (error) {
            [self networkError];
            return;
        }

        [self setPageArray:[NSMutableArray arrayWithArray:objects]]; // needs to call the accessor in order to trigger KVO notififaction

        //NSLog(user);
        //NSLog(@"pageArray, %@", objects);
        NSLog(@"pageArray, %lu", (unsigned long)[objects count]);

    }];
}



- (void) queryAllTagsAndPages {
    
    
/*
 PFQuery *query = [PFQuery queryWithClassName:@"Comment"];
 
 // Retrieve the most recent ones
 [query orderByDescending:@"createdAt"];
 
 // Only retrieve the last ten
 query.limit = 10;
 
 // Include the post data with each comment
 [query includeKey:@"post"];
 
 [query findObjectsInBackgroundWithBlock:^(NSArray *comments, NSError *error) {
 // Comments now contains the last ten comments, and the "post" field
 // has been populated. For example:
 for (PFObject *comment in comments) {
 // This does not require a network access.
 PFObject *post = comment[@"post"];
 NSLog(@"retrieved related post: %@", post);
 }
 }];
 */
    
    PFQuery *allPagesQuery = [PFQuery queryWithClassName:@"Page"];

    
    [allPagesQuery findObjectsInBackgroundWithBlock:^(NSArray *objects, NSError *error) {


        if (error == nil) {
            self.pageArray = [NSMutableArray arrayWithArray:objects];

            /*for (PFObject *object in objects) {
            }*/
        }
        else {

            [self networkError];
            return;
        }

    }];
}




- (void) queryAllUserTags {

    PFQuery *allUserTagsQuery = [UserTag query];

    [allUserTagsQuery findObjectsInBackgroundWithBlock:^(NSArray *objects, NSError *error) {

        if (error == nil) {
            self.userTagsArray = [NSMutableArray arrayWithArray:objects];

            NSLog(@"userTagsArray, %lu", (unsigned long)[objects count]);

            /*for (PFObject *object in objects) {
                 NSLog(@"queryAllUsrTags @%", object.updatedAt);
            }*/
        }
        else {

            [self networkError];
            return;
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
