import { test, expect } from '@playwright/test';

class CrossFunctionalProjectPlanPageTests {
    constructor(page) {
      this.page = page;
      this.doingHeader = page.getByRole('heading', { name: 'Doing' });
      this.todoHeader = page.getByRole('heading', { name: 'To do' });
      this.doneHeader = page.getByRole('heading', { name: 'Done' });
      this.untitledSectionHeader = page.getByRole('heading', { name: 'Untitled section' });
      this.foundProject = page.getByTestId('TypeaheadScrollable-contents');
      this.todoDPB = page.getByText('Draft project brief', { exact: true });
      this.todoSTWT = page.getByText('Share timeline with teammates', { exact: true });
      this.todoSKM = page.getByText('Schedule kickoff meeting', { exact: true });
    }
    
    async verifyTodos(todo, expectedTags){
      await expect(this.doingHeader).toBeVisible();
      await expect(this.todoHeader).toBeVisible();
      await expect(this.doneHeader).toBeVisible();
      await expect(this.untitledSectionHeader).toBeVisible();

      if (todo == 'Draft project brief'){
        await expect(this.todoDPB).toBeVisible();
        await this.todoDPB.click();

      } else if ( todo == 'Share timeline with teammates'){
        await expect(this.todoSTWT).toBeVisible();
        await this.todoSTWT.click();

      } else if (todo == 'Schedule kickoff meeting'){
        await expect(this.todoSKM).toBeVisible();
        await this.todoSKM.click();

      } else {
        const throwError = () => {
          throw new Error();
        };
        await expect(throwError).toThrow(todo + ' is not part of the application');
      }

      const priorityLocator = await this.page.getByLabel('Priority ' + expectedTags[0]);
      const statusLocator = await this.page.getByLabel('Status ' + expectedTags[1]);

      await priorityLocator.waitFor({ state: 'visible' });
      await statusLocator.waitFor({ state: 'visible' });

      await expect(priorityLocator).toBeVisible();
      await expect(statusLocator).toBeVisible();

      if (priorityLocator && statusLocator) {
        console.log("To do verification is completed!");
    } else {
        console.log("failed!");
    }
  }
}

export default CrossFunctionalProjectPlanPageTests;
