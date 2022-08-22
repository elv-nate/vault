import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

/**
 * @module Oidc::AssignmentForm
 * Oidc::AssignmentForm components are used to display the create view for OIDC providers assignments.
 *
 * @example
 * ```js
 * <Oidc::AssignmentForm @model={this.model}
 * @onCancel={transition-to "vault.cluster.access.oidc.assignment"} @param1={{param1}}
 * @onSave={transition-to "vault.cluster.access.oidc.assignments.assignment.details" this.model.name}
 * />
 * ```
 * @callback onCancel
 * @callback onSave
 * @param {object} model - The parent's model
 * @param {string} onCancel - callback triggered when cancel button is clicked
 * @param {string} onSave - callback triggered when save button is clicked
 */

export default class OidcAssignmentFormComponent extends Component {
  @service store;
  @service flashMessages;
  @tracked modelValidations;
  @tracked errorBanner;
  @tracked invalidFormMessage;

  @task
  *save(event) {
    event.preventDefault();
    try {
      const { isValid, state, invalidFormMessage } = this.args.model.validate();
      this.modelValidations = isValid ? null : state;
      this.invalidFormMessage = invalidFormMessage;
      if (isValid) {
        const { isNew, name } = this.args.model;
        yield this.args.model.save();
        this.flashMessages.success(`Successfully ${isNew ? 'created' : 'updated'} the assignment ${name}.`);
        // this form is sometimes used in modal, passing the model notifies
        // the parent if the save was successful
        this.args.onSave(this.args.model);
      }
    } catch (error) {
      const message = error.errors ? error.errors.join('. ') : error.message;
      this.errorBanner = message;
    }
  }

  @action
  cancel() {
    const method = this.args.model.isNew ? 'unloadRecord' : 'rollbackAttributes';
    this.args.model[method]();
    this.args.onCancel();
  }

  @action
  handleOperation({ target }) {
    this.args.model.name = target.value;
  }

  @action
  onEntitiesSelect(selectedIds) {
    this.args.model.entityIds = selectedIds;
  }

  @action
  onGroupsSelect(selectedIds) {
    this.args.model.groupIds = selectedIds;
  }
}