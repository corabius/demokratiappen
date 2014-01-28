//
//  Party.m
//  DemokratiAppen
//
//  Created by Joakim Rydell on 2014-01-11.
//  Copyright (c) 2014 Joakim Rydell. All rights reserved.
//

#import "Party.h"


@implementation Party


- (id) initWithName:(NSString *)aName acronym:(NSString *)anAcronym plusScore:(int)aPlusScore minusScore:(int)aMinusScore color:(NSString *)aColor {
    self = [super init];
    _name = aName;
    _acronym = anAcronym;
    _plusScore = aPlusScore;
    _minusScore = aMinusScore;

    _color = [self hexStringToUIColor: aColor];
    
    return self;
}


- (UIColor*) hexStringToUIColor: (NSString*)aColor{

    NSString *redStr = [NSString stringWithFormat:@"0x%@", [aColor substringWithRange:NSMakeRange(0, 2)]];
    float red = strtol([redStr cStringUsingEncoding:NSASCIIStringEncoding], NULL, 16) / 255.0;

    NSString *greenStr = [NSString stringWithFormat:@"0x%@", [aColor substringWithRange:NSMakeRange(2, 2)]];
    float green = strtol([greenStr cStringUsingEncoding:NSASCIIStringEncoding], NULL, 16) / 255.0;

    NSString *blueStr = [NSString stringWithFormat:@"0x%@", [aColor substringWithRange:NSMakeRange(4, 2)]];
    float blue = strtol([blueStr cStringUsingEncoding:NSASCIIStringEncoding], NULL, 16) / 255.0;

    return [UIColor colorWithRed:red green:green blue:blue alpha:1.0];
}


- (NSString*) uiColorToHexString: (UIColor*)aColor{

     /*const CGFloat *components = CGColorGetComponents(aColor.CGColor);
     NSString *colorAsString = [NSString stringWithFormat:@"%f,%f,%f,%f", components[0], components[1], components[2], components[3]];

    return colorAsString;*/

    if (aColor == [UIColor whiteColor]) {
        // Special case, as white doesn't fall into the RGB color space
        return @"ffffff";
    }

    CGFloat red;
    CGFloat blue;
    CGFloat green;
    CGFloat alpha;

    [aColor getRed:&red green:&green blue:&blue alpha:&alpha];

    int redDec = (int)(red * 255);
    int greenDec = (int)(green * 255);
    int blueDec = (int)(blue * 255);

    NSString *colorAsString = [NSString stringWithFormat:@"%02x%02x%02x", (unsigned int)redDec, (unsigned int)greenDec, (unsigned int)blueDec];

    return colorAsString;


}




@end
