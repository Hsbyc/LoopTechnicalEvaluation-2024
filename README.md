run using >> npx playwright test

If test fails at welcomePageTests line between 18 to 27, probably i guess hours wrong for greeting message.

        <!-- if (currentHour >= 0 && currentHour < 12) {
        // If it's between 12 AM and 12 PM (morning)
        await expect(greetingLocator).toHaveText('Good morning, Ben');
        } else if (currentHour >= 12 && currentHour < 18) {
        // If it's between 12 PM and 12 AM (evening)
        await expect(greetingLocator).toHaveText('Good afternoon, Ben');
        } else {
        // If it's between 12 PM and 12 AM (evening)
        await expect(greetingLocator).toHaveText('Good evening, Ben');
        } -->

Also search bar have an issue (i might be wrong which could be my mistake) that once you search and search item show up list, you cant click on it, test stops there till i hover my mouse but hover() functions are not working too..
welcomePageTests.dynamicSearch() method.
/***************Attencion*******************/
//This part of application is not working as expected. Once located the search bar list 
//item which are on of these, its not moving forward to related page. 
//For now, i just added this bypass to keep the tests going on.