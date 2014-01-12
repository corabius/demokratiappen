//
//  Party.h
//  DemokratiAppen
//
//  Created by Joakim Rydell on 2014-01-11.
//  Copyright (c) 2014 Joakim Rydell. All rights reserved.
//

#import <Foundation/Foundation.h>


@interface Party : NSObject

@property NSString *name;
@property NSString *acronym;
@property int plusScore;
@property int minusScore;
@property UIColor *color;

- (id) initWithName: (NSString*)aName acronym:(NSString*)anAcronym plusScore:(int)aPlusScore minusScore:(int)aMinusScore color: (NSString*)aColor;

@end
