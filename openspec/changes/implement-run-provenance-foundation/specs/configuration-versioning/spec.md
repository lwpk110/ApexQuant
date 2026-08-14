## ADDED Requirements

### Requirement: Versioned configuration snapshots
The system MUST create configuration versions with a unique version ID, immutable values, effective time, and scope. Creating a new version MUST retain all prior versions.

#### Scenario: Save new configuration
- **WHEN** a caller saves configuration values for a scope
- **THEN** a new version becomes current for that scope and the values are readable exactly as saved

#### Scenario: Read historical configuration
- **WHEN** a prior version is requested after a newer version is saved
- **THEN** the prior values remain readable and unchanged

### Requirement: Configuration provenance is separate from runs
Updating the current configuration MUST NOT mutate any existing run snapshot.

#### Scenario: Update after run creation
- **WHEN** a run is created using configuration version A and configuration version B is later saved
- **THEN** the run continues to reference version A and its recorded values remain unchanged
