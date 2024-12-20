import { AlignmentObjectExtended } from './alignment-object-extended';

export interface AlignmentObjects {
  earlyChildhoodEducationSubjects: AlignmentObjectExtended[];
  earlyChildhoodEducationObjectives: AlignmentObjectExtended[];
  prePrimaryEducationSubjects: AlignmentObjectExtended[];
  prePrimaryEducationObjectives: AlignmentObjectExtended[];
  basicStudySubjects: AlignmentObjectExtended[];
  basicStudyObjectives: AlignmentObjectExtended[];
  basicStudyContents: AlignmentObjectExtended[];
  preparatoryEducationSubjects: AlignmentObjectExtended[];
  preparatoryEducationObjectives: AlignmentObjectExtended[];
  upperSecondarySchoolSubjectsOld: AlignmentObjectExtended[];
  upperSecondarySchoolCoursesOld: AlignmentObjectExtended[];
  upperSecondarySchoolObjectives: AlignmentObjectExtended[];
  upperSecondarySchoolSubjectsNew: AlignmentObjectExtended[];
  upperSecondarySchoolModulesNew: AlignmentObjectExtended[];
  upperSecondarySchoolObjectivesNew: AlignmentObjectExtended[];
  upperSecondarySchoolContentsNew: AlignmentObjectExtended[];
  vocationalDegrees: AlignmentObjectExtended[];
  vocationalUnits: AlignmentObjectExtended[];
  subjectOfCommonUnit: AlignmentObjectExtended[];
  vocationalRequirements: AlignmentObjectExtended[];
  selfMotivatedEducationSubjects: AlignmentObjectExtended[];
  selfMotivatedEducationObjectives: AlignmentObjectExtended[];
  scienceBranches: AlignmentObjectExtended[];
  scienceBranchObjectives: AlignmentObjectExtended[];
}
