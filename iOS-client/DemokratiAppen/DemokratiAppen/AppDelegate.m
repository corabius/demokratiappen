//
//  AppDelegate.m
//  DemokratiAppen
//
//  Created by Joakim Rydell on 2014-01-11.
//  Copyright (c) 2014 Demokratiappen
//

#import "AppDelegate.h"
#import <Parse/Parse.h>
#import "Page.h"
#import "Tag.h"
#import "UserTag.h"
#import "TestFlight.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{

    [TestFlight takeOff:@"8dcf0abe-9e39-4391-8f94-a54d059674dd"];

    // Register classes to parse
    [Page registerSubclass];
    [Tag registerSubclass];
    [UserTag registerSubclass];

    [Parse setApplicationId:@"p7Nu6RZkIlnGUfofyOvms99yDnehPjzHg18OuFra"
                  clientKey:@"jGbdwHMTsG4KRT96YjNf8fr1vEXdKuj94zF2p4wf"];

    [PFFacebookUtils initializeFacebook];
    [PFAnalytics trackAppOpenedWithLaunchOptions:launchOptions];
    
    UIPageControl *pageControl = [UIPageControl appearance];
    pageControl.pageIndicatorTintColor = [UIColor lightGrayColor];
    pageControl.currentPageIndicatorTintColor = [UIColor blackColor];
    pageControl.backgroundColor = [UIColor whiteColor];
    
    return YES;
    

}

- (void)applicationWillResignActive:(UIApplication *)application
{
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later. 
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
}

- (void)applicationWillEnterForeground:(UIApplication *)application
{
    // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
}

- (void)applicationWillTerminate:(UIApplication *)application
{
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
}


//Using Custom URL Scheme to Launch Application
//enabling other apps to open this app (with the schema: demokratiappen) => demokratiappen://some/path
- (BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url{
    // Do something with the url here
    if (!url) {
        return NO;
    }

    NSString *URLString = [url absoluteString];
    NSLog(URLString);

    NSLog(@"url recieved: %@", url);
    NSLog(@"query string: %@", [url query]);
    NSLog(@"host: %@", [url host]);
    NSLog(@"url path: %@", [url path]);

    //[[NSUserDefaults standardUserDefaults] setObject:URLString forKey:@"url"];
    //[[NSUserDefaults standardUserDefaults] synchronize];
    return YES;
}

@end
