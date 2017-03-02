import * as Actions from '../../src/redux/actions/groups';
import groupsReducer, { groupTemplate, initialState } from '../../src/redux/reducers/groups';
import client from '../../src/network';

// import expect from 'expect';
// import thunk from 'redux-thunk';
// import complete from '../helpers/complete';
// import { registerMiddlewares } from 'redux-actions-assertions';
import { registerAssertions } from 'redux-actions-assertions/jasmine';
import deepClone    from 'mout/src/lang/deepClone';
/* global describe it afterEach beforeEach*/


function setSpy(target, method, data) {
  spyOn(target, method)
    .and.returnValue(Promise.resolve({ data }));
}

Object.freeze(initialState);

describe('group actions', () => {
  const groupUsers = [{ _id: 'abc', name: 'Alice' }, { _id: 'def', name: 'Jake' }];
  const someGroup = { _id: '123', name: 'some group' };
  describe('simple actions', () => {
    beforeEach(registerAssertions);
    it('lists new users', (done) => {
      const expectedAction = { type: Actions.LIST_USERS, groupId: '123', users: groupUsers };
      expect(Actions.listUsers('123', groupUsers))
        .toDispatchActions(expectedAction, done);

      const newState = deepClone(initialState);
      newState.usersByGroup = { 123: groupUsers };
      expect(groupsReducer(initialState, expectedAction))
        .toEqual(newState);
    });

    it('adds group', (done) => {
      const expectedAction = { type: Actions.ADD_GROUP };
      expect(Actions.addGroup())
        .toDispatchActions(expectedAction, done);

      const newState = deepClone(initialState);
      const newGroup = deepClone(groupTemplate);
      newGroup.name = 'new group 0';
      newState.list = [newGroup];
      newState.active = 0;
      expect(groupsReducer(initialState, expectedAction))
        .toEqual(newState);
    });

    it('updates local group', (done) => {
      const expectedAction = { type: Actions.SAVE_GROUP, index: 0, group: someGroup };
      expect(Actions.updateLocalGroup(0, someGroup))
        .toDispatchActions(expectedAction, done);

      const newState = deepClone(initialState);
      const thisGroup = deepClone(someGroup);
      newState.list = [thisGroup];
      newState.active = 0;
      newState.mapById[thisGroup._id] = thisGroup;
      expect(groupsReducer(initialState, expectedAction))
        .toEqual(newState, done);

      // delete thisGroup._id;
      // newState.mapById = {};
      // expect(groupsReducer(initialState, expectedAction))
      //   .toEqual(newState, done);
    });
  });

  describe('async actions', () => {
    beforeEach(registerAssertions);

    afterEach(() => {
      // expect.restoreSpies();
    });

    it('creates a group', (done) => {
      setSpy(client, 'createGroup', someGroup);
      const expectedAction = { type: Actions.SAVE_GROUP, index: 0, group: someGroup };
      expect(Actions.saveGroup(0, someGroup))
        .toDispatchActions(expectedAction, done);
    });

    // it('updates a remote group', () => {
    //   setSpy(client, 'editGroup', someGroup);
    //   // several "edits"
    //   Actions.updateGroup(0, someGroup);
    //   Actions.updateGroup(0, someGroup);
    //   Actions.updateGroup(0, someGroup);
    //   Actions.updateGroup(0, someGroup);
    //   // should only be updated remotely once
    //   setTimeout(() => {
    //     expect(client.editGroup.calls.length).toEqual(10);
    //     expect(client.editGroup).toHaveBeenCalled().with(0, someGroup);
    //   }, 500);
    // });

    it('adds users to a group', (done) => {
      setSpy(client, 'addGroupInvitation', someGroup);
      expect(Actions.addToGroup('123', 'abc'))
        .toDispatchActions([], done);
      expect(client.addGroupInvitation.calls.count()).toEqual(1);
      expect(client.addGroupInvitation).toHaveBeenCalledWith('123', { userId: 'abc', level: 2, force: true });


      // expect(Actions.addToGroup('123', ['abc', 'def', 'ghi']))
      //   .toDispatchActions([], (err) => {
      //     expect(client.addGroupInvitation.calls.length).toEqual(4231, done);
      //   });
    });
  });
});
