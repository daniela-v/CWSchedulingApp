const jwt = require('jsonwebtoken');

const { Coursework, CourseworkParticipant } = require('./db/models').models;

module.exports = {
  /**
   * Returns whether the user has permission to view the coursework or not
   *
   * @param {Integer} userId          - The user id taken from the session (defaults to 0 if guest)
   * @param {Integer} courseworkId    - The coursework id to check permissions for (defaults to 0 if undefined)
   * @returns {Boolean}  True if the user has access to the coursework
   *
   * @throws {Object}  _system or _notification error
   */
  async hasCourseworkReadOnlyPermission(userId = 0, courseworkId = 0, sharedToken = null) {
    const coursework = await Coursework.findOne({ where: { id: courseworkId } });
    if (!coursework) {
      throw { _system: 'System called hasCourseworkReadOnlyPermission with an invalid coursework' };
    }

    // Checking access token from shared link
    if (sharedToken) {
      // Trying to use an access token on a coursework that does not have sharing enabled should throw an explanatory notification error
      if (!coursework.shared) {
        throw { _notification: 'This coursework does not have sharing enabled' };
      }
      // Attempting to sign the access jwt
      try {
        jwt.verify(sharedToken, `${coursework.shared}`);
      } catch (e) {
        sharedToken = null;
      }
    }

    // Checking if the coursework is private and the client doesn't have a valid shared token
    if (coursework.isPrivate && !sharedToken) {
      const isOwner = (coursework.owner === userId);
      const isParticipant = await CourseworkParticipant.findOne({ where: { coursework: courseworkId, user: userId } });
      if (!isOwner && !isParticipant) {
        throw { _notification: 'You have not been invited to view this coursework' };
      }
    }
    return true;
  },

  /**
   * Returns whether the user has permission to view the coursework or not
   *
   * @param {Integer} userId          - The user id taken from the session (defaults to 0 if guest)
   * @param {Integer} courseworkId    - The coursework id to check permissions for (defaults to 0 if undefined)
   * @returns {Boolean}  True if the user has access to the coursework
   *
   * @throws {Object}  _system or _notification error
   */
  async hasCourseworkWritePermission(userId = 0, courseworkId = 0) {
    const coursework = await Coursework.findOne({ where: { id: courseworkId } });
    if (!coursework) {
      throw { _system: 'System called hasCourseworkWritePermission with an invalid coursework' };
    }
    const isOwner = (coursework.owner === userId);
    if (!isOwner) {
      throw { _notification: 'You are not the owner of this coursework' };
    }
    return true;
  },
};
