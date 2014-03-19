//
//  PageContentViewController.h
//  DemokratiAppen
//
//  Created by Kevin Ivan on 19/03/14.
//  Copyright (c) 2014 Demokratiappen. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface PageContentViewController : UIViewController

@property (weak, nonatomic) IBOutlet UIImageView *backgroundImageView;
@property (weak, nonatomic) IBOutlet UILabel *titleLabel;

@property NSUInteger pageIndex;
@property NSString *titleText;
@property NSString *imageFile;

@end
