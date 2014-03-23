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

#import <Foundation/Foundation.h>


@interface Party : NSObject

@property NSString *name;
@property NSString *acronym;
@property int plusScore;
@property int minusScore;
@property UIColor *color;


- (id) initWithName: (NSString*)aName acronym:(NSString*)anAcronym plusScore:(int)aPlusScore minusScore:(int)aMinusScore color: (NSString*)aColor;

- (UIColor*) hexStringToUIColor: (NSString*)aColor;
- (NSString*) uiColorToHexString: (UIColor*)aColor;

@end
