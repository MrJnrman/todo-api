module.exports = {
  'Todo Api Frontend Test': function (browser) {
    var api = browser.page.todo();

    api.navigate()
      .assert.title('Todo App')
      .assert.visible('@newTask')
      .setValue('@newTask', 'Night Watch Test')
      .click('@add', function () {
        browser.pause(500);
      })
      .assert.containsText('@incomplete', 'Night Watch Test')
      .assert.visible('@incompleteEditButton')
      .click('@incompleteEditButton')
      .assert.visible('@incompleteEditTask')
      .clearValue('@incompleteEditTask')
      .assert.containsText('@incompleteEditTask', '')
      .setValue('@incompleteEditTask', 'Night Watch Updated Test')
      .click('@incompleteEditTaskButton', function () {
        browser.pause(500);
      })
      .assert.containsText('@incomplete', 'Night Watch Updated Test')
      .click('@incompleteCheckBox', function () {
        browser.pause(500);
      })
      .assert.containsText('@complete', 'Night Watch Updated Test')
      .click('@completeCheckBox', function () {
        browser.pause(500);
      })
      .assert.containsText('@incomplete', 'Night Watch Updated Test')
      .click('@incompleteDeleteButton', function () {
        browser.pause(500);
      });

    browser.expect.element('body').text.to.not.contain('Night Watch Updated Test');
    browser.end();
  }
};

