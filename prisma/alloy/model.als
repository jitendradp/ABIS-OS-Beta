//
// Ein Alloy-Modell für das Prisma-Basisdatenmodell.
//
// TODO: Es sind noch keine Operationen implementiert.
// TODO: Folgende Typen sind noch gar nicht modelliert: Session, Tag, Location.

// ====================================
// Entry
//
sig Entry {
	owner: one Profile
}

	fact "Alle Einträge müssen in einer Gruppe sein" {
		all e: Entry
		| one g: Group
		| e in g.entries
	}

// ====================================
// Group
//
// Gruppen können Mitgliedschaften und Einträge enthalten.
// Gruppen und Entries können durch Link-Tags in Beziehung zueinander gesetzt werden.
abstract sig Group {
	owner: one Agent,
	memberships: set Membership,
	entries: set Entry
}

	//
	// Membership
	//
	fact "Der 'owner' einer Gruppe darf nicht Mitglied der Gruppe sein" {
		no g: Group 				// Es gibt keine Gruppe,
		| some m: Membership 		// .. mit einer oder mehreren Mitgliedschaften,
		| m in g.memberships 		// .. die in dieser Gruppe enthalten sind,
		&& g.owner = m.member 		// .. und deren 'member' auch 'owner' der Gruppe ist.
	}

	fact "Keine Gruppe hat Mitgliedschaften, die nicht von einem Gruppen-owner, einem Mitglied der Gruppe oder dem Mitglied selber erstellt wurden" {
		no g: Group
		| some m: g.memberships
		| not(m.creator = g.owner
		   || m.creator in g.memberships.*member
		   || m.creator = m.member)
	}

	fact "Es gibt keine Gruppe, die mehr als eine SingleMembership des selben Users enthält" {
		no g: Group 						// Keine Gruppe
		| some disj m, m': SingleMembership		// kann zwei SingleMemberships
		| m.member.owner = m'.member.owner	// des selben Benutzers
	    && m in g.memberships				// enthalten
		&& m' in g.memberships				// ..
	}

	fact "Es gibt keine Gruppe, mit einer SingleMembership eines Users, wenn der User auch Owner der Gruppe ist" {
		no g: Group
		| some m: SingleMembership
		| m in g.memberships
		&& m.member.owner = g.owner.owner
	}

	fact "Es gibt keine Gruppe die sowohl eine Single- als auch eine MultiMembership des selben Users enthält" {
		// Sollte das der Fall sein, muss die bisher existierende SingleMembership in eine MultiMembership umgewandelt werden
		no g: Group
		| some m, m': Membership
		| m.member.owner = m'.member.owner
		&& m in SingleMembership
		&& m' in MultiMembership
		&& m in g.memberships
		&& m' in g.memberships
	}

	fact "Es gibt keine Gruppe, die nur eine MultiMembership eines Users enthält, der nicht owner der Gruppe ist" {
		no g: Group
		| one m: MultiMembership
		| m in g.memberships
		&& not(m.member.owner = g.owner.owner)
	}

	fact "Es gibt keine Gruppe, die zwei Mitgliedschaften des selben Agents enthält" {
		no g: Group
		| some disj m, m': g.memberships
		| m.member = m'.member
	}

	//
	// Entries
	//
	fact "Es gibt keine Gruppe, die Entries von nicht-ownern oder nicht-Mitgliedern enthält" {
		// Verlässt ein Mitglied die Gruppe, wird die ownership seiner Entries an den Gruppepn-Owner übertragen.
		// TODO: Das tatsächliche prisma-Modell benötigt neben dem "owner"-Feld immer auch ein "creator" Feld.
		no g: Group
		| some e: g.entries
		| not (e.owner = g.owner
			|| e.owner in g.memberships.*member)
	}

// ====================================
// Stash
//
// Ein Stash ist ein privater Bereich
sig Stash extends Group {
}

	fact "Ein Stash hat keine Mitglieder" {
		all s: Stash
		| no s.memberships
	}

	fact "Es gibt keinen Stash mit Einträgen, deren Owner nicht auch der Owner des Stash ist" {
		no s: Stash
		| some e: s.entries
		| not(e.owner = s.owner)
	}

// ====================================
// Channel
//
// Channels sind uni-direktional. Die Richtung ist: 'owner' -> 'member'.
// Es kann nur einen Channel pro Agent-Kombination und Richtung geben.
// Zur Anzeige in der Benutzeroberfläche werden die Inhalte beider Channels
// anhand ihres Zeitstempels zusammengefügt und angezeigt.
sig Channel extends Group {
}

	//
	// Memberships
	//
	fact "Ein Channel hat immer genau ein Mitglied" {
		all c: Channel
		| one c.memberships
	}
	// TODO: fact "Die Mitglieder eines Channels dürfen sich nach der ersten Zuweisung nicht mehr ändern" {}
	fact "Es gibt keine Channels mit Mitgliedschaften, die nicht vom Channel-Owner erstellt wurden" {
		no c: Channel
		| some m: c.memberships
		| not(m.creator = c.owner)
	}

	fact "Es gibt keine zwei Channels mit derselben owner/member-Kombination" {
		/// Es gibt keine zwei Channels, mit demselben owner und mitglied
		no disj c, c': Channel
		| some m, m': Membership
		| m in c.memberships
		&& m' in c'.memberships
		&& c.owner = c'.owner
		&& m.member = m'.member
	}

	//
	// Entries
	//
	fact "Es gibt keinen Channels mit Einträgen, deren Owner nicht auch der Owner des Channels ist" {
		no c: Channel
		| some e: c.entries
		| not(e.owner = c.owner)
	}


// ====================================
// Inbox
//
sig Inbox {
	owner: one Agent,
	represents: one Room
}

	fact "Der 'owner' der Inbox ist auch 'owner' des repräsentierten Raums" {
		all i: Inbox
		| i.owner = i.represents.owner
	}

// ====================================
// Room
//
sig Room extends Group {
	isPublic: one Boolean
}

	fact "Jeder Raum hat eine Inbox" {
		all r: Room
		| one i: Inbox
		| i.represents = r
	}

	fact "Kein nicht-öffentlicher Raum hat Mitgliedschaften, die von ihrem Mitglied selbst erstellt wurden" {
		no r: Room
		| some m: Membership
		| m in r.memberships
		&& r.isPublic = False
		&& m.creator = m.member
	}

// ====================================
// Membership
//
abstract sig Membership {
	member: one Agent,
	creator: one Agent
}

	fact "Alle Mitgliedschaften müssen jeweils genau in einer Gruppe sein" {
		all m: Membership 			// Für jede Mitgliedschaft,
		| one g: Group				// .. gibt es exakt eine Gruppe,
		| m in g.memberships		// .. in deren 'memberships' sie enthalten ist.
	}


// ====================================
// SingleMembership
//
sig SingleMembership extends Membership {
}

// ====================================
// MultiMembership
//
// Eine spezielle Membership, die immer dann vergeben wird, wenn ein User
// über verschiedene Profile oder Services in demselben Raum teilnimmt.
// Es muss in der UI zwischen Membership und MultiMembership unterscheidbar sein.
// Da ein Raum-"owner" auch immer gleichzeitig implizites Mitglied ist,
// sind Memberships von Usern in Räumen, die ihnen gehören, Multimemberships.
sig MultiMembership extends Membership {
}

// ====================================
// Agent
//
abstract sig Agent {
	owner: one User
}

// ====================================
// Profile
//
// Etwas, das den User selbst nach außen repräsentiert. Zu verstehen als Visitenkarte, Künstlername oder Pseudonym.
sig Profile extends Agent {
}

	fact "Jedes Profil hat mindestens einen Stash" {
		all p: Profile
		| some s:Stash
		| s.owner = p
	}

// ====================================
// Service
//
// Etwas, das eine Dienstleistung eines Users nach außen repräsentiert.
// Diese Dienstleistung richtet sich immer an die Gruppen, in der der Service Mitglied ist.
// Services sollten als eine Art Task betrachtet werden. Sie sind dementsprechend kurzlebig.
// Sobald ein Service erfüllt ist. Verlässt er die Gruppe.
// Ein Service ohne Gruppe kann nicht existieren, somit verschwindet der Service.
sig Service extends Agent {
}

	fact "Es gibt keinen Service, der nicht genau eine Mitgliedschaft hat" {
		no s:Service
		| no m: Membership
		| m.member = s
	}

	fact "Es gibt keinen Service, dessen Mitgliedschaft nicht von einem Profil erstellt wurde" {
	    // Es gelten ansonsten alle anderen Regeln für das Erstellen von Mitgliedschaften
		no s:Service
		| some m: Membership
		| m.member = s
		&& not (m.creator in Profile)

	}

// ====================================
// User
//
// Eine natürliche oder juristische Person
sig User {
}

	fact "Alle Benutzer müssen mind. ein Profil besitzen" {
		all u: User
		| some p: Profile
		| p.owner = u
	}

// ====================================
// Helper
//
abstract sig Boolean {}
one sig True extends Boolean {}
one sig False extends Boolean {}


// ====================================
// Assertions
//
run {} for 6

// Es gibt keine Mitgliedschaften in nicht-öffentlichen Gruppen,
// die nicht entweder vom owner der Gruppe oder
// von einem anderen Mitglied erstellt wurden.
assert a {
	no m: Membership
	| some g: Room
	| g.isPublic = False
	&& m in g.memberships
	&& not(m.creator = g.owner
	   || m.creator in g.memberships.*member)

}
check a for 4
