/* Copyright (C) 2014 Demokratiappen.
 *
 * This file is part of Demokratiappen.
 *
 * Demokratiappen is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Demokratiappen is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Demokratiappen.  If not, see <http://www.gnu.org/licenses/>.
 */

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
