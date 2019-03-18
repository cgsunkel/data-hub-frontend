@interactions-collection @collection
Feature: Hide collection for non dit users

  @interactions-collection--lep @lep
  Scenario: Navigate to interactions shows 403 for LEPs
    When I navigate to the `interactions.list` page
    Then I see the 403 error page

  @interactions-collection--da @da
  Scenario: Navigate to interactions shows 403 for DAs
    When I navigate to the `interactions.list` page
    Then I see the 403 error page
