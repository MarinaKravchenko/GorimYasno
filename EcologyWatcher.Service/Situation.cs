//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace EcologyWatcher.Service
{
    using System;
    using System.Collections.Generic;
    
    public partial class Situation
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Situation()
        {
            this.Accident = new HashSet<Accident>();
        }
    
        public int Situation_Id { get; set; }
        public string Situation_Name { get; set; }
        public string Situation_Icon { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Accident> Accident { get; set; }
    }
}