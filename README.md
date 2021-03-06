![OAK Icon](https://raw.githubusercontent.com/CentauriSoldier/OAK/main/oak/android-chrome-192x192.png?raw=true)

# OAK

The **O**pen **A**d **K**iosk

## What is O.A.K.?

OAK is an **O**pen **A**d **K**iosk using [PHP](https://www.php.net/), [Javascript](https://www.javascript.com/), [HTML](https://html.com/) and [SQLite](https://sqlite.org/index.html). It is designed to be hosted on a php-enabled server (either local or remote) and viewed through a web browser. This server hosts 'ads', 'promos' or whatever term you prefer for infomation in the form of image and video media. There are two roles available for interacting with OAK. One is the **Ad Manager**, the other is the **Ad Player**.

### Setup

OAK is designed to be simple and easy to setup and use. It is literally a matter of dropping the OAK directory into the server folder, enabling a few options in your php.ini and then going to the manager page for the initial setup procedure. Adding, editing and deleting ads is equally simple. There is no database setup, no external dependencies and no fuss.

#### Your Setup TODO List

- Put the oak directory into the proper server folder where the oak website will hosted.
- In the ***php.ini*** file, be sure that the **SQlite3** extension is enabled.
- In the ***php.ini*** file, be sure that **file uploads** is enabled.
- In the ***php.ini*** file, set the maximum upload file size allowed by modifying the ***upload_max_filesize***, ***'post_max_size'*** and ***'memory_limit'***.
- Be sure that the user ***'http'*** has read and write access to the ads folder *(where the database and ads are stored)*.
- Navigate to the manager page (yoursite.com/manager.php) and follow the prompts.

## The Manager

The manager's role is to affect ads in a specific way by either adding ads, editing exisitng ads or deleting ads.

### Custom Icon
You can use a custom logo image by placing your image in the ***img*** directory and naming it ***userLogo.png***. It will be displayed anywhere a custom logo would be shown. It should be proportionally square.

## The Data

All of the data are stored in an SQLite database located in the ads directory. For this reason, there is no need to setup an external database in order to use OAK.

## Ad Player

As the name suggests, the player's role is to display fullscreen ads on a device. The player is a rather *'dumb'* role in that it has no real control and may only display ads in a manner dictated to it by the manager. It serves no other function.

### Player Features

- Displays fullscreen ads.
- Automatically restarts on error.
- Auto-scales ads appropriately to a given screen.

#### Displaying Ads


#### Notes On Player Setup

While simply going to the oak website index page is sufficient for running ads, it is advised that each ad kiosk also have a [static IP](https://www.lifewire.com/what-is-a-static-ip-address-2626012) in order that it may obtain *(optionally)* unique settings from the manager and remember them. In this way, each player may run a specific ad profile as defined in the manager. Once again, this is not nessessary but if a player's IP is not set to static, it cannot remember the manager nor can the manager remember it. As such, it will use the default settings rather than any player-specific settings as set in the manager. Once again, this is ***optional***.

## Stay Calm And Use Alpha

This product is in alpha. Some of the features may not yet be implemented or may be broken. The code is subject to change drastically as this project moves towards beta. It is advised to not use OAK in a production environment until the beta release; however, if you do decide to use OAK in a production environment, nothing untoward should occur other than perhaps an error showing on your ad kisok.
