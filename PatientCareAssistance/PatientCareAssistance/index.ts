import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { PatientCareAssistantComponent } from "./PatientCareAssistantComponent";
import * as React from "react";
import { getPatientCareRecommendation } from "./CopilotService";

export class PatientCareAssistance implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;
    private _patientId = "";
    private _symptoms = "";
    private _treatmentPlan = "";
    private _loading = false;
    private _context: ComponentFramework.Context<IInputs>;

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
        this._context = context;
        this._patientId = context.parameters.patientId?.raw ?? "";
        this._symptoms = context.parameters.symptoms?.raw ?? "";
        this._treatmentPlan = context.parameters.treatmentPlan?.raw ?? "";
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        this._context = context;
        this._patientId = context.parameters.patientId?.raw ?? "";
        this._symptoms = context.parameters.symptoms?.raw ?? "";
        this._treatmentPlan = context.parameters.treatmentPlan?.raw ?? "";
        return React.createElement(PatientCareAssistantComponent, {
            patientId: this._patientId,
            symptoms: this._symptoms,
            treatmentPlan: this._treatmentPlan,
            getPatientCareRecommendation: getPatientCareRecommendation,
            context: this._context,
            setTreatmentPlan: (plan: string) => {
                this._treatmentPlan = plan;
                this.notifyOutputChanged();
            }
        });
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        return {
            treatmentPlan: this._treatmentPlan
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
